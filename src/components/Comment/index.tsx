import React, { PureComponent } from 'react';
import '@waline/client/waline.css';
import { init } from '@waline/client';

export default class Comment extends PureComponent {
  constructor(props) {
    super(props);
    this._commentRef = React.createRef();
  }

  async componentDidMount() {
    if (typeof window === 'undefined') {
      return;
    }
    if (!this._commentRef.current) {
      return;
    }

    this.Waline = init({
      el: this._commentRef.current,
      serverURL: 'https://comment.threefish.site/',
      pageview: true,
      // visitor: true, // 开启阅读量统计
      path: this.props.id,
      lang: 'zh-CN',
      comment: true,
      dark: 'html[data-theme="dark"]',
    });
  }

  render() {
    return <div className="comment-area" ref={this._commentRef} />;
  }
}
