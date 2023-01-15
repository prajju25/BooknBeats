const audioInfo = async (input, key) => {
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': key,
			'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
		}
	};

    const res = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${input}`, options)
	const data = await res.json();
    return data;
};

export default audioInfo;