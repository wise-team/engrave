import axios from 'axios';

interface rawComment {
  author: string;
  permlink: string;
  body: string;
}

export default class Comment {
  public children: Comment[] = [];
  constructor(
    public author: string,
    public permlink: string,
    public body: string,
    public data: any,
  ) {
    console.log('Comment created');
  }

  public async loadChildren() {
    if (this.data.children == 0) { return this.children; }

    // console.log(`loading replies to @${this.author}/${this.permlink}`);
    const rawComments = await axios.post('/comments', {
      author: this.author,
      permlink: this.permlink,
    });

    this.children = rawComments.data.map(
      (d: rawComment) => new Comment(d.author, d.permlink, d.body, d),
    );

    this.children.forEach((c: Comment) => {
      c.loadChildren();
    });

    return this.children;
  }

  get payout() {
    return (
      parseFloat(this.data.total_payout_value.replace(' SBD', '')) +
      parseFloat(this.data.curator_payout_value.replace(' SBD', ''))
    );
  }
}
