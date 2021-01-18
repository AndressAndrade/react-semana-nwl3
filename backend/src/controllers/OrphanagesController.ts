import {Request, Response} from 'express';
import { getRepository } from "typeorm";
import * as Yup from 'yup';

import Orphanage from "../models/Orphanage";
import orphanagesView from "../views/orphanagesView";

export default {


    async index(request: Request, response: Response) {
        const orphanagesRepository = getRepository(Orphanage);
        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });
        return response.status(200).json(orphanagesView.renderMany(orphanages));
    },

    async show(request: Request, response: Response) {
        const {id} = request.params;
        const orphanagesRepository = getRepository(Orphanage);

        try {
            const orphanage = await orphanagesRepository.findOneOrFail(id, {
                relations: ['images']
            });
            return response.status(200).json(orphanagesView.render(orphanage));
        }
        catch {
            return response.status(200).json({});
        }
        
    },

    async create(request: Request, response: Response) {

        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return {path: image.filename}
        });

        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
        } = request.body;
    
        const orphanageRepository = getRepository(Orphanage);
    
        try {
        
            const data = {
                name,
                latitude,
                longitude,
                about,
                instructions,
                opening_hours,
                open_on_weekends: open_on_weekends === 'true',
                images
            };

            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                latitude: Yup.number().required('Latitude obrigatório'),
                longitude: Yup.number().required('Longitude obrigatório'),
                about: Yup.string().required('Sobre obrigatório').max(300),
                instructions: Yup.string().required('Instruções obrigatórias'),
                opening_hours: Yup.string().required('Horário de visitas obtigatório'),
                open_on_weekends: Yup.boolean().required('Informação sobre abertura aos finais de semana obrigatório'),
                images: Yup.array(
                    Yup.object().shape({
                        path: Yup.string()
                    })
                )
            });

            await schema.validate(data, {
                abortEarly: false
            });

            const orphanage = orphanageRepository.create(data);
        
            await orphanageRepository.save(orphanage);
        
            return response.status(201).json({
                message: 'Orfanato criado com sucesso',
                status: true
            });
        }
        catch(erro) {
            return response.status(500).json({
                message: 'Problemas ao criar orfanato',
                status: false,
                erro: erro.message
            });
        }
    }
    
}