const audioDetails = async (input, key) => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': key,
            'X-RapidAPI-Host': 'youtube-search-results.p.rapidapi.com'
        }
    };

    const res = await fetch(
        `https://youtube-search-results.p.rapidapi.com/youtube-search/?q=${input}`
        , options);
    const data = await res.json();
    if(data && data.items) return data.items[0];
    return data;
};

export default audioDetails;