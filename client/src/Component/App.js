import React from 'react';
import axios from 'axios';
import Loading from "./Loading";

import '../Assets/css/App.css';

import NavTop from './NavTop';

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            form_expand: false,
            content_title: null,
            content_file: null,
            content_text: null,
            loading: false
        }

        this.form_expands = this.form_expands.bind(this)
    }

    componentDidMount() {
        axios.post('http://localhost:3000/api/posts/list', {
            'keys': 'keysstatic',
            'content_title': 'Example Title Section'
        }).then(result => {
            this.setState({
                posts: result.data.data
            })
            // this.post = result.data;
            console.log(result.data.data);
        }).catch(err => {
            console.log(err);
        });

        setTimeout(() => {
            this.setState({
                loading: true
            })
        }, 10000);
    }

    form_expands() {
        this.setState(state => {
            return this.state.form_expand = !this.state.form_expand;
            // alert(this.state.form_expand);
        })
    }

    onTitleChange = e => this.setState({ content_title: e.target.value });
    onTextChange = e => this.setState({ content_text: e.target.value });

    onSubmitHandler = (e) => {
        e.preventDefault();
        console.log(this.state);
        const self = this;
        const data = new FormData();

        data.append('keys', 'keysstatic');
        data.append('content_title', this.state.content_title);
        data.append('content_images', this.state.content_file);
        data.append('content_text', this.state.content_text);

        console.log("is loop", data);
        axios.post('http://localhost:3000/api/posts/create', data).then(result => {
            console.log("Result", result);
            const join = self.state.posts.concat(result.data.data);
            self.setState({posts: join});
        }).catch(err => {
            console.log(err);
        });
    }

    fileSelectedHandler = event => {
        this.setState({
            content_file: event.target.files[0]
        })

        console.log(event.target.files);
    }

    render() {
        const { posts } = this.state;
        // console.log(posts);
        const postsData = posts.length ? (
          posts.map((result, i) => {
            return (
                <div className="col-4 mb-4" key={i}>
                    <div className="card border-lighten">
                        <img src={'http://localhost:3000/uploads/' + result.content_image} alt="" className="card-img-top"/>
                        <h2 className="card-header border-lighten bg-transparent">
                            { result.content_title }
                        </h2>
                        <div className="card-body">{result.content_text}</div>
                    </div>
                </div>
            );
          })
        ) : (
            <div className="col-12 mb-4">
                <div className="card border-lighten shadow-sm">
                    <h2 className="card-header border-0 bg-transparent">
                        No Post yet!
                    </h2>
                </div>
            </div>
        );

        const { content_title, content_images, content_text } = this.state ;

        return (
          <div>
            <NavTop />
            <div className={ this.state.loading ? 'loading-wrap d-none' : 'loading-wrap'}>
                <Loading />
            </div>
            <aside>
                <div onClick={this.form_expands} className={ this.state.form_expand ? 'uploads expand' : 'uploads' }>
                    <span>+</span>
                </div>
            </aside>
            <main className="__main">
                <div className={this.state.form_expand ? 'form-posts expand' : 'form-posts'}>
                    <div className="container">
                        <form onSubmit={this.onSubmitHandler}>
                            <div className="form-group">
                                <label htmlFor="content_title">
                                    <h3 className="mb-0 text-light">Title</h3>
                                </label>
                                <input type="text"
                                    id="content_title"
                                    className="form-control border-0 rounded-2"
                                    name="content_title"
                                    defaultValue={content_title}
                                    onChange={this.onTitleChange}
                                    />
                            </div>
                            <div className="form-group">
                                <label htmlFor="content_images">
                                    <h3 className="mb-0 text-light">Image</h3>
                                </label>
                                <div className="custom-file">
                                    <input
                                        id="customFile"
                                        type="file"
                                        className="custom-file-input border-0 rounded-2"
                                        id="customFile"
                                        name="content_images"
                                        onChange={this.fileSelectedHandler}
                                        />
                                    <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="content_text">
                                    <h3 className="mb-0 text-light">Content</h3>
                                </label>
                                <textarea
                                    name="content_text"
                                    id="content_text"
                                    rows="5"
                                    className="form-control border-0 rounded-2"
                                    defaultValue={content_text}
                                    onChange={this.onTextChange}
                                    >
                                </textarea>
                            </div>
                            <div className="form-group">
                                <input className="btn btn-lg btn-warning w-100 rounded-2" type="submit" value="SUBMIT"/>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="container pt-5">
                    <div className="row">
                        { postsData }
                    </div>
                </div>
            </main>
          </div>
        );
    }
}
