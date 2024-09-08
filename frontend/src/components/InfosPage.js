import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';

const InfosPage = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const pageId = "358190007925013";
    const accessToken = "EAALXBdqZAoFQBO201TcKlKt08H3XkMDRcf7a78v4uz9INOEHZAHdGziSU1jTMQuBdnCKG9oSCFAP222ZBH2dq8DbK8gig02FHEopC8XAZCONnyXbKs3SmDZAsFPzHHhF8zIURZCj1856btprBfNzR4ZAb0ZBz2ClMTnkBCn1vqwAikPLy1UE1Db97xEgIwZDZD";

    useEffect(() => {
        const fetchFacebookPosts = async () => {
            try {
                const response = await axios.get(
                    `https://graph.facebook.com/v20.0/${pageId}/feed?access_token=${accessToken}&fields=message,created_time,permalink_url`
                );
                setPosts(response.data.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des posts Facebook:', error);
                setError('Impossible de récupérer les dernières publications Facebook.');
            }
        };

        fetchFacebookPosts();
    }, [pageId, accessToken]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="club-page w-full">
            <Header title={`Informations Diverses et Actualités`} />
            <div className="flex flex-wrap gap-4 px-4 mt-2">
                {posts.length === 0 ? (
                    <p>Aucune publication récente disponible.</p>
                ) : (
                    posts.map((post, index) => (
                        <div key={index} className="post-item bg-gray-100 p-4 rounded-lg shadow-md">
                            <p>{post.message}</p>
                            <p className="text-sm text-gray-500">Publié le {new Date(post.created_time).toLocaleDateString()}</p>
                            <a href={post.permalink_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Voir sur Facebook</a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default InfosPage;
