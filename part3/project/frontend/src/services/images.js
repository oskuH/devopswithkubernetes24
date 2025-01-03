import axios from 'axios'

const getImageUrl = () => {
    const request = axios.get('/api', { responseType: 'arraybuffer' });
    return request.then(response => {
        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        return url;
  });
}

const axiosFunctions = { getImageUrl }

export default axiosFunctions