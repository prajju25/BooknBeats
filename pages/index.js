import React, { useState } from 'react';
import { Container, Grid, Input, Comment, Button, Message, Table, Icon } from 'semantic-ui-react';
import Header from '../components/Header';
import audioDetails from './api/audiodetails';
import audioInfo from './api/audioinfo';

const Home = (props) => {
    const [searchInput, setsearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [songList, setSongList] = useState([]);
    const [error, setError] = useState({
        isError: false,
        errorMsg: ''
    });

    const searchSongs = async (e) => {        
        e.preventDefault();
        setIsLoading(true);
        console.log("Calling OpenAI...")
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ searchInput }),
        });
    
        const data = await response.json();
        const { output } = data;
        console.log("OpenAI replied...", output.text);
        if(output.text) {
            let list = output.text.split('\n').filter(d=>d || d != "");
            let s = [];
            for(let l of list) {
                let val = l.replaceAll(/[0-9.\\]+/g,'').trim();
                const response = await audioDetails(val, props.listKey);
                if(response && response.id) {
                    const info = await audioInfo(response.id, props.infoKey);
                    if(info && info.link) {
                        response.link = info.link;
                        s.push(response);
                        //setSongInfo(info);
                        //setError({isError: false, errorMsg: ''});
                    } else {
                        //setError({isError: true, errorMsg: info.message});
                        //setSongInfo({});
                    }
                } else if (response && response.message){
                    setError({isError: true, errorMsg: response.message});
                    break;
                }
            }
            if(s.length > 0) setSongList(s);
        }
        setIsLoading(false);
    }

    return (
        <Container>
            <Header />
            <Grid className='container-body'>
                <Grid.Row>
                    <Grid.Column>
                        <Comment.Group size='massive'>
                            <Comment>
                                <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/christian.jpg' />
                                <Comment.Content>
                                    <Comment.Author as='a'>Hi!! I am BuknBeats</Comment.Author>
                                    <Comment.Text>
                                        Tell me which book you are reading, I will recommend songs which vibe with the book.....&#128540;&#128540;
                                    </Comment.Text>
                                </Comment.Content>
                            </Comment>
                        </Comment.Group>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Input
                            value={searchInput}
                            onChange={(e) => setsearchInput(e.target.value)}
                            disabled={isLoading}
                            className='search-input'
                            size='huge'
                            placeholder='Provide a Book Name...'
                        />
                        <Button primary 
                            loading={isLoading} 
                            onClick={searchSongs}
                            size='huge'>
                            Search
                        </Button>
                    </Grid.Column>
                </Grid.Row>
                {error.isError && (
                <Grid.Row>
                    <Message negative>
                        <Message.Header>We're sorry!! cannot load the song playlists</Message.Header>
                        <p>{error.errorMsg}</p>
                    </Message>
                </Grid.Row>
                )}
                {songList && songList.length > 0 && (<>
                    <Grid.Row>
                        <h2>Playlist:</h2>                        
                        <Table compact celled>
                            <Table.Header>
                                <Table.Row>
                                <Table.HeaderCell>Player</Table.HeaderCell>
                                <Table.HeaderCell>Song Name</Table.HeaderCell>
                                <Table.HeaderCell>Artist</Table.HeaderCell>
                                <Table.HeaderCell>Duration</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>      
                            <Table.Body>
                                {songList.map((song)=>(
                                    <Table.Row key={song?.id}>
                                        <Table.Cell collapsing>
                                            <audio controls>
                                                <source src={song?.link} type="audio/mp3" />
                                            </audio>
                                        </Table.Cell>
                                        <Table.Cell>{song?.title}</Table.Cell>
                                        <Table.Cell>{song?.author?.name}</Table.Cell>
                                        <Table.Cell>{song?.duration}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Grid.Row></>)
                }
            </Grid>
        </Container>
    )
};

Home.getInitialProps = () => {
    let listKey = process.env.AUDIO_LIST_API_KEY;
    let infoKey = process.env.AUDIO_INFO_API_KEY;
    console.log(process.env.AUDIO_LIST_API_KEY);    
    console.log(process.env.AUDIO_INFO_API_KEY);
    return {listKey, infoKey}
}

export default Home;