import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import BlogLayout from '@root/components/blog/BlogLayout';

const BlogPostCreate = Loadable(
  lazy(() => import('@pages/blog/BlogPostCreate'))
);
const BlogPostDetails = Loadable(
  lazy(() => import('@pages/blog/BlogPostDetails'))
);
const BlogPostList = Loadable(lazy(() => import('@pages/blog/BlogPostList')));

export const blogRoute = {
  path: 'blog',
  element: <BlogLayout />,
  children: [
    {
      path: '/',
      element: <BlogPostList />,
    },
    {
      path: 'new',
      element: <BlogPostCreate />,
    },
    {
      path: ':postId',
      element: <BlogPostDetails />,
    },
  ],
};
