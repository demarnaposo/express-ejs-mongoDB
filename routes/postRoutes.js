import express, { application } from 'express';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';


const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

// Initialize upload variable with the storage engine

const upload = multer({storage: storage})



router.get('/', async (req, res) => {
    
    res.render('index', {title: 'Home Page', active: 'home'})
})

// route for my posts page

router.get('/my-posts', protectedRoute, async (req, res) => {

    try {

        const userId = req.session.user._id;
        const user = await User.findById(userId).populate('posts');

        if(!user){
            req.flash('error', 'User not found!')
            return res.redirect('/')
        }

        res.render('posts/my-posts', {
            title: 'My Posts', 
            active: 'my-posts',
            posts: user.posts
        })


        
    } catch (error) {
        console.error(error)
        req.flash('error', 'An error occured while fetching your posts!')
        res.redirect('/my-posts')
        
    }

    
})

// route for create new post page

router.get('/create-post', protectedRoute, (req, res) => {
    res.render('posts/create-post', { title: 'Create Post', active: 'create-post' })
})

// route for edit post page

router.get('/edit-post/:id', protectedRoute, async (req, res) => {

    try {

        const postId = req.params.id
        const post = await Post.findById(postId)
        
    } catch (error) {
        console.error(error)

        req.flash('error', 'Something went wrong!')
        res.redirect('/my-posts')
        
    }

    res.render('posts/edit-post', { title: 'Edit Post', active: 'edit-post' })
})

// route for view post in detail 
router.get('/post/:id', (req, res) => {
    res.render('posts/view-post', { title: 'View Post', active: 'view-post' })
})


// handle create new post request

router.post('/create-post', protectedRoute, upload.single('image'), async (req, res) => {
    
    try {

        const {title, content} = req.body
        const image = req.file.filename

        const slug = title.replace(/\s+/g, '-').toLowerCase(); 

        const user = await User.findById(req.session.user._id);

        // create new post

        const post = new Post({ title, slug, content, image, user })

        // save post in user posts array

        await User.updateOne({_id: req.session.user._id}, {$push: {posts: post._id}}),
        await post.save();


        req.flash('success', 'Post Created Successfuly!');
        res.redirect('/my-posts')
        
        
    } catch (error) {
        console.error(error)
        req.flash('error', 'Something went wrong!')
        res.redirect('/create-post')
    }

})

export default router;
