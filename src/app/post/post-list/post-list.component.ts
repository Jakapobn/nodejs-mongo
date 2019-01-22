import { Component, OnInit, OnDestroy } from "@angular/core";
import { Posts } from "src/app/model/post.model";
import { PostsService } from "src/app/service/posts.service";
import { Subscription } from "rxjs";
import { post } from "selenium-webdriver/http";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.scss"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Posts[] = [];
  private postsSub: Subscription;
  isLoading = false;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Posts[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
