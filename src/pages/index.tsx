import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import Link from 'next/link';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiCalendar, FiUser } from "react-icons/fi";

import { useState } from 'react';
import { useEffect } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [next, SetNext] = useState(null);
  const [btnRender, SetBtnRender] = useState(false);

  useEffect(() => {
    setPosts(postsPagination.results);
    SetNext(postsPagination.next_page);
    SetBtnRender(postsPagination.next_page !== null);

  }, []);

  async function handlepush() {
    if (postsPagination.next_page === next) {
      fetch(`${postsPagination.next_page}`)
        .then(response => response.json())
        .then((data) => {
          setPosts([...posts, {
            uid: String(data.results[0].uid),
            first_publication_date: data.results[0].first_publication_date,
            data: data.results[0].data,
          }
          ]);
          SetNext(data.next_page);
        })
    } else {
      if (next !== null) {
        fetch(`${next}`)
          .then(response => response.json())
          .then((data) => {
            setPosts([...posts, {
              uid: String(data.results[0].uid),
              first_publication_date: data.results[0].first_publication_date,
              data: data.results[0].data,
            }
            ]);
            SetNext(data.next_page);
            SetBtnRender(data.next_page !== null)
          })

      }
    }

  }
  /*console.log(postsPagination);
  console.log(postsPagination.results);*/



  return (

    <>
      <main className={styles.container}>

        <img src="/images/logo.svg" alt="logo" />
        {console.log(posts)}
        {console.log(next)}
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>

              <a  >
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div>
                  <time>
                    <span><FiCalendar /></span>
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </time>

                  <p>
                    <span><FiUser /></span>
                    {post.data.author}
                  </p>
                </div>
              </a>
            </Link>
          ))}
        </div>

        {btnRender ? (
          <button type="button"
            className={next == null ? styles.buttonull : styles.buttonOn}
            disabled={next == null ? true : false}
            onClick={handlepush}
          >Carregar mais posts
          </button>) : (
          ''
        )}


      </main>
    </>
  );
  // TODO
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
    pageSize: 1,
  })
  const NxPage = postsResponse.next_page
  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: post.data,
    };
  });

  const postsPagination: PostPagination = {
    next_page: NxPage,
    results: posts,
  };

  return {

    props: {
      postsPagination
    }
  }

  // TODO
};
