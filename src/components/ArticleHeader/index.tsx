import React, { useEffect } from 'react';
import { pageviewCount, commentCount } from '@waline/client';
import '@waline/client/waline.css';
import Admonition from '@theme/Admonition';
import {
  BranchesOutlined,
  EyeOutlined,
  CommentOutlined,
} from '@ant-design/icons';

export const PageviewCount: React.FC<{ path: string }> = ({ path }) => {
  useEffect(() => {
    pageviewCount({
      serverURL: 'https://comment.threefish.site/',
      path,
    });
  }, []); // 只在组件挂载时执行一次

  return <span className="waline-pageview-count" data-path={path} />;
};

export const CommentCount: React.FC<{ path: string }> = ({ path }) => {
  useEffect(() => {
    commentCount({
      serverURL: 'https://comment.threefish.site/',
      path,
    });
  }, [path]); // 在 `path` 变化时重新执行

  return <span className="waline-comment-count" data-path={path} />;
};

function Spacer() {
  return <>{' · '}</>;
}

export const DocHeader: React.FC<{ path: string; updatedAt: string }> = ({
  path,
  updatedAt,
}) => {
  return (
    <div id="article-info">
      <Admonition type="info">
        <>
          <BranchesOutlined /> {updatedAt}
          <Spacer />
          <EyeOutlined /> <PageviewCount path={path} />
          <Spacer />
          <CommentOutlined /> <CommentCount path={path} />
        </>
      </Admonition>
    </div>
  );
};

export const BlogHeader: React.FC<{ path: string }> = ({ path }) => {
  return (
    <>
      <EyeOutlined /> <PageviewCount path={path} />
      <Spacer />
      <CommentOutlined /> <CommentCount path={path} />
    </>
  );
};
