import Admonition from '@theme/Admonition';
import {
  BranchesOutlined,
  EyeOutlined,
  CommentOutlined,
} from '@ant-design/icons';

export default function ArticleHeader({ path, updatedAt }) {
  return (
    <div id="article-info">
      <Admonition type="info">
        <p>
          <span className="article-hearder-update">
            <BranchesOutlined /> {updatedAt}
          </span>
          <span className="article-hearder-reads">
            <EyeOutlined />{' '}
            <span className="waline-pageview-count" data-path={path} />
          </span>
          <span>
            <CommentOutlined />{' '}
            <span className="waline-comment-count" data-path={path} />
          </span>
        </p>
      </Admonition>
    </div>
  );
}
