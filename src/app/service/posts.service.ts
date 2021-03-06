import { Injectable } from "@angular/core";
import { Posts } from "../model/post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class PostsService {
  posts: Posts[] = [];
  postsUpdate = new Subject<Posts[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        })
      )
      .subscribe(transformPosts => {
        this.posts = transformPosts;
        this.postsUpdate.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this, this.postsUpdate.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: String; title: String; content: String }>(
      "http://localhost:3000/api/posts/" + id
    );
  }

  addPost(title: string, content: string) {
    const post: any = { id: undefined, title: title, content: content };
    this.http
      .post<{ message: string; postId: string }>(
        "http://localhost:3000/api/posts",
        post
      )
      .subscribe(responseData => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdate.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Posts = { id: id, title: title, content: content };
    this.http
      .put("http://localhost:3000/api/posts/" + id, post)
      .subscribe(res => {
        const updatePosts = [...this.posts];
        const oldPostIndex = updatePosts.findIndex(p => p.id === post.id);
        updatePosts[oldPostIndex] = post;
        this.posts = updatePosts;
        this.postsUpdate.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const updatedPost = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPost;
        this.postsUpdate.next([...this.posts]);
      });
  }
}
