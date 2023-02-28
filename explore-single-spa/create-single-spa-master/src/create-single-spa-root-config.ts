import { registerApplication, start, LifeCycles } from 'single-spa'

// registerApplication({
//   name: '@single-spa/welcome',
//   app: () => System.import<LifeCycles>('https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js'),
//   activeWhen: ['/'],
// })

registerApplication({
  name: '@create-single-spa/slave-react',
  app: () => System.import<LifeCycles>('//localhost:8081/create-single-spa-slave-react.js'),
  activeWhen: ['/'],
})

start({
  urlRerouteOnly: true,
})
