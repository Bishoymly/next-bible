/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Map old language codes to new ones
      {
        source: '/arabic/:path*',
        destination: '/avd/:path*',
        permanent: true,
      },
      {
        source: '/kjames/:path*',
        destination: '/kjv/:path*',
        permanent: true,
      },
      
      // Remove 'new', 'old', and 'second' from the paths
      {
        source: '/avd/new/:path*',
        destination: '/avd/:path*',
        permanent: true,
      },
      {
        source: '/avd/old/:path*',
        destination: '/avd/:path*',
        permanent: true,
      },
      {
        source: '/avd/second/:path*',
        destination: '/avd/:path*',
        permanent: true,
      },
      {
        source: '/kjv/new/:path*',
        destination: '/kjv/:path*',
        permanent: true,
      },
      {
        source: '/kjv/old/:path*',
        destination: '/kjv/:path*',
        permanent: true,
      },
      {
        source: '/kjv/second/:path*',
        destination: '/kjv/:path*',
        permanent: true,
      },
      
      // Handle the case where old URLs have 'new', 'old', 'second' before the redirect happens
      {
        source: '/arabic/new/:path*',
        destination: '/avd/:path*',
        permanent: true,
      },
      {
        source: '/arabic/old/:path*',
        destination: '/avd/:path*',
        permanent: true,
      },
      {
        source: '/arabic/second/:path*',
        destination: '/avd/:path*',
        permanent: true,
      },
      {
        source: '/kjames/new/:path*',
        destination: '/kjv/:path*',
        permanent: true,
      },
      {
        source: '/kjames/old/:path*',
        destination: '/kjv/:path*',
        permanent: true,
      },
      {
        source: '/kjames/second/:path*',
        destination: '/kjv/:path*',
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
