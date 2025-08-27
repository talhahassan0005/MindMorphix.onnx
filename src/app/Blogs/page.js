'use client'

import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Blogs() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        const res = await fetch('/api/rssblogs');
        const data = await res.json();
        const allArticles = data.articles || [];

        // Get the current date and calculate the date 5 months ago
        const currentDate = new Date();
        const fiveMonthsAgo = new Date();
        fiveMonthsAgo.setMonth(currentDate.getMonth() - 5);

        // Filter articles to only include those within the last 5 months
        const filteredArticles = allArticles.filter(article => {
          const articleDate = new Date(article.date);
          return articleDate >= fiveMonthsAgo;
        });

        setArticles(filteredArticles);
      } catch (err) {
        console.error("Client fetch error:", err);
      }
    };

    fetchRSS();
  }, []);

  return (
    <div className="bg-dark text-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="container">
        <div className="text-center mb-16 border-bottom pb-12">
          <h1 className="display-4 font-weight-bold text-light">
            Latest Deep Learning Blogs
          </h1>
          <p className="mt-6 lead text-light max-w-3xl mx-auto">
            Stay updated with cutting-edge articles in AI and neuroimaging.
          </p>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
          {articles.map((article) => (
            <div key={article.id} className="col mb-4">
              <div className="card bg-dark text-light shadow-lg h-100">
                <div className="card-body">
                  <p className="card-text text-primary">Deep Learning</p>
                  <h3 className="card-title text-light">
                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-light">
                      {article.title}
                    </a>
                  </h3>
                  <p className="card-text text-light">{article.excerpt}</p>

                  {/* Image Display */}
                  {article.image && (
                    <image src={article.image} alt={article.title} className="img-fluid mb-3" />
                  )}

                  <div className="mt-4">
                    <p className="text-secondary">
                      <strong>{article.author}</strong> | {new Date(article.date).toLocaleDateString()}
                    </p>
                    <p className="text-secondary">
                      Source: Analytics Vidhya
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="h3 font-weight-bold text-light">
            Stay Updated on Neurotechnology Advances
          </h2>
          <p className="mt-4 text-lg text-light">
            Subscribe to receive the latest research on AI-powered diagnostics
          </p>
          <div className="mt-8">
            <button className="btn btn-primary btn-lg">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
