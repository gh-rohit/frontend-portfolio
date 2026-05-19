import { useState, useEffect } from 'react';
import { client, urlFor } from '../sanityClient';

const AboutSection = () => {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const query = `*[_type == "author"][0] {
          name, role, profileImage, shortBio, specialties, location
        }`;
        const data = await client.fetch(query);
        setAuthor(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    fetchAuthor();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/2 h-80 bg-white/5 rounded-2xl"></div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="h-8 bg-white/5 rounded w-1/3"></div>
              <div className="h-4 bg-white/5 rounded w-full"></div>
              <div className="h-4 bg-white/5 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!author) {
    return (
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400">Add author in Sanity Studio</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-30"></div>
              {author.profileImage ? (
                <img
                  src={urlFor(author.profileImage).width(500).url()}
                  alt={author.name}
                  className="relative rounded-2xl w-full shadow-2xl"
                />
              ) : (
                <div className="relative aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                  <span className="text-6xl">📸</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <span className="inline-block px-4 py-2 bg-white/5 rounded-full text-sm text-purple-400">
              👋 Get to know me
            </span>
            <h2 className="text-4xl font-bold">
              I'm <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{author.name}</span>
            </h2>
            <p className="text-xl text-purple-400">{author.role}</p>
            <p className="text-gray-300 leading-relaxed">
              {author.shortBio || "Passionate about creating beautiful product experiences and capturing their essence through photography."}
            </p>
            {author.specialties && (
              <div className="flex flex-wrap gap-2">
                {author.specialties.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300">
                    {s}
                  </span>
                ))}
              </div>
            )}
            <p className="text-gray-400">📍 {author.location || 'India'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;