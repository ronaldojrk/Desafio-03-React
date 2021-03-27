import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import { useRouter } from 'next/router'
import styles from './post.module.scss';
import { FiCalendar, FiUser, FiClock } from "react-icons/fi";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';
interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {

  const total = post.data.content.reduce((Palavras, content) => {
    Palavras += content.heading.split(' ').length;
    const words = content.body.map(item => item.text.split(' ').length);
    words.map(palavraBody => (Palavras += palavraBody));
    return Palavras;
  }, 0);
  const time = Math.ceil(total / 200)
  const router = useRouter()

  console.log("o isFallback")
  console.log(router.isFallback)
  //console.log(post.data)
  //console.log(JSON.stringify(post.data.banner.url, null, 2))
  if (router.isFallback == true) {

    return <h1>Carregando...</h1>
  }

  return (
    <>
      <Header />
      <div className={styles.Container}>
        <img src={post.data.banner.url} alt="banner" />
        <div className={styles.Content}>
          <h2>{post.data.title}</h2>
          <div className={styles.infoContent}>
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
            <p>
              <span><FiClock /></span>
              {`${time} min`}
            </p>
          </div>

          <div className={styles.body}>
            {post.data.content.map(content => (
              <div key={content.heading} className={styles.contentHeader}>
                <h2>{content.heading}</h2>
                <div
                  className={styles.contentBody}
                  dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body) }}
                />

              </div>
            ))}
          </div>

        </div>



      </div>
    </>
  );
  // TODO
}

export const getStaticPaths: GetStaticPaths = async () => {

  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    pageSize: 2, page: 2
  });
  const uidPosts = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      }
    };
  });
  console.log(uidPosts);
  return {
    paths: uidPosts,
    fallback: true,
  }


};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params;
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: response.data,
  }

  /**console.log("slug da pagina");
  console.log(slug);*/
  return {
    props: {
      post,
    },

  }
};
