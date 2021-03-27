import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiCalendar, FiUser } from "react-icons/fi";

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

export default function Home() {

  return (

    <>
      <main className={styles.container}>
        <img src="/images/logo.svg" alt="logo" />
        <div className={styles.posts}>
          <a href="">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <time>
                <span><FiCalendar /></span>
                15 Mar 2021
              </time>

              <p>
                <span><FiUser /></span>
                Joseph Oliveira
              </p>
            </div>
          </a>

        </div>
        <button type="button">Carregar mais posts</button>
      </main>
    </>
  );
  // TODO
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
