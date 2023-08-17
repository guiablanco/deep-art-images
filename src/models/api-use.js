import axios from "axios";

const API_KEY = 'WyRi3b8sNN5c1xHR1wl7V63JkqNlTCC15H7xKDeW';
const API_ENDPOINT =  'https://api.deeparteffects.com/v1/noauth';

export const getStyles = () => {
    return axios.get(`${API_ENDPOINT}/styles`, {
        headers: {
            'x-api-key': API_KEY,
        },
    });
}

export const applyArtEffect = (styleId, imageBase64Encoded, imageSize, partnerId, optimazeForPrint, useOriginalColors) => {
    return axios.post(
        `${API_ENDPOINT}/upload`,
        {
            styleId,
            imageBase64Encoded,
            imageSize,
            partnerId,
            optimazeForPrint,
            useOriginalColors
        },
        {
            headers: {
                'x-api-key': API_KEY,
            }
        }
    );
}

export const getSubmissionStatus = (submissionId) => {
    return axios.get(`${API_ENDPOINT}/result?submissionId=${submissionId}`, {
        headers:{
            'x-api-key': API_KEY
        }
    });
}
