import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import JssProvider from 'react-jss/lib/JssProvider'
import getContext from '../styles/getContext'

class MyDocument extends Document {
  render () {
    return (
      <html lang='en' dir='ltr'>
        <Head>
          <title>My page</title>
          <meta charSet='utf-8' />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name='viewport'
            content={
              'user-scalable=0, initial-scale=1, ' +
              'minimum-scale=1, width=device-width, height=device-height'
            }
          />
          {/*
            manifest.json provides metadata used when your web app is added to the
            homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
          */}
          <link rel='manifest' href='/static/manifest.json' />
          {/* PWA primary color */}
          <meta name='theme-color' content={this.props.stylesContext.theme.palette.primary[500]} />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

MyDocument.getInitialProps = ctx => {
  // Resolution order
  //
  // On the server:
  // 1. page.getInitialProps
  // 2. document.getInitialProps
  // 3. page.render
  // 4. document.render
  //
  // On the server with error:
  // 2. document.getInitialProps
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. page.getInitialProps
  // 3. page.render

  // Get the context to collected side effects.
  const context = getContext()
  const page = ctx.renderPage(Component => props => (
    <JssProvider
      registry={context.sheetsRegistry}
      jss={context.jss}
      generateClassName={context.generateClassName}
    >
      <Component {...props} />
    </JssProvider>
  ))

  return {
    ...page,
    stylesContext: context,
    styles: (
      <style
        id='jss-server-side'
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: context.sheetsRegistry.toString() }}
      />
    )
  }
}

export default MyDocument
