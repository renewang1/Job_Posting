import express from 'express';
import controller from '../controllers/jobs';
const router = express.Router();

router.get('/jobs', controller.getJobs);
router.get('/jobs/:id', controller.getJob);
router.put('/jobs/:id', controller.updateJob);
router.delete('/jobs/:id', controller.deleteJob);
router.post('/jobs', controller.addJob);

export = router;