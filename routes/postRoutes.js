import express, { application } from 'express';
import { protectedRoute } from '../middlewares/authMiddleware.js';


const router = express.Router();


router.get('/', async (req, res) => {
    
    res.render('index', {title: 'Home Page', active: 'home'})
})

// route for my posts page

router.get('/my-posts', protectedRoute, (req, res) => {
    res.render('posts/my-posts', {title: 'My Posts', active: 'my-posts'})
})

// route for create new post page

router.get('/create-post', protectedRoute, (req, res) => {
    res.render('posts/create-post', { title: 'Create Post', active: 'create-post' })
})

// route for edit post page

router.get('/edit-post/:id', protectedRoute, (req, res) => {
    res.render('posts/edit-post', { title: 'Edit Post', active: 'edit-post' })
})

// route for view post in detail 
router.get('/post/:id', (req, res) => {
    res.render('posts/view-post', { title: 'View Post', active: 'view-post' })
})

export default router;
