import axios from 'axios';
export class PixabayAPI {
    static BASE_URL = 'https://pixabay.com/api';
    static MY_PIXABAY_KEY = '33192781-4f448e121a78d7e82e3362da2';
  
    constructor() {
      this.query = null;
      this.pageNumber = null;
    }
  
    fetchImages() {
        // const searchParams = new URLSearchParams (
        //     {
        //         key: PixabayAPI.MY_PIXABAY_KEY,
        //         q: this.query,
        //         image_type: 'photo',
        //         orientation: 'horizontal',
        //         safesearch: true,
        //         per_page: 40,
        //         page: this.pageNumber,
        //       }
        // )
        const searchParameters = {
            params: {
              key: PixabayAPI.MY_PIXABAY_KEY,
              q: this.query,
              image_type: 'photo',
              orientation: 'horizontal',
              safesearch: true,
              per_page: 40,
              page: this.pageNumber,
            },
          };
     
      return axios.get(`${PixabayAPI.BASE_URL}/`, searchParameters);
    }
  }