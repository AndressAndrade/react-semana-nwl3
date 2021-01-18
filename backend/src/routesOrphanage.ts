import {Router} from 'express';
import multer from 'multer';

import upladConfig from './config/upload';
import OrphanagesController from './controllers/OrphanagesController';

const routesOrphanage = Router();
const upload = multer(upladConfig);

// index, show, create, update, delete
routesOrphanage.get('/orphanages', OrphanagesController.index);
routesOrphanage.get('/orphanages/:id', OrphanagesController.show);
routesOrphanage.post('/orphanages', upload.array('images'), OrphanagesController.create);

export default routesOrphanage;