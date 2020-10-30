new TWTR.Widget({
    version: 2,
    type: 'profile',
    rpp: 2,
    interval: 5000,
    width: 'auto',
    height: 120,
    theme: {
      shell: {
        background: '#ff7b76',
        color: '#ffffff'
      },
      tweets: {
        background: '#ffffff',
        color: '#666666',
        links: '#000000'
      }
    },
    features: {
      scrollbar: false,
      loop: true,
      live: true,
      hashtags: true,
      timestamp: true,
      avatars: false,
      behavior: 'default'
    }
  }).render().setUser('smohadjer').start();
	