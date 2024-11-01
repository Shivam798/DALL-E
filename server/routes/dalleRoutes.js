import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const router = express.Router(); 
const HUGGING_API_KEY = process.env.HUGGINGFACE_API_TOKEN;
router.route('/').get((req,res)=>{
    res.send("Hello from DALL-E!!")
})
router.route('/').post(async(req,res)=>{
    try {
        const  {prompt}  = req.body;
        async function query(data) {
            const response = await axios.post(
                "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
                data,
                {
                    headers: {
                        Authorization:  `${HUGGING_API_KEY}`, 
                        "Content-Type": "application/json",
                    },
                    responseType: 'arraybuffer', 
                }
            );
            return Buffer.from(response.data, 'binary').toString('base64');
        }
        query({ "inputs": prompt }).then(async ( base64Image ) => {
            res.status(200).json({ photo:  `data:image/jpeg;base64,${base64Image}`});
        }).catch((error) => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to generate image' });
        });
    } catch (error) {
        res.status(500).send(error.message)
    }
})
export default router;