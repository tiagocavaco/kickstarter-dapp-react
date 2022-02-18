import 'semantic-ui-css/semantic.min.css';
import Header from '@components/header'
import Footer from '@components/footer'
import { Container } from 'semantic-ui-react';

const Layout = ({ children }) => {
  return (
    <Container style={{ marginTop: "0.5rem" }}>
      <Header />
      <main style={{ marginTop: "2rem", marginBottom: "2rem" }}>{children}</main>
      <Footer />
    </Container>
  )
}

export default Layout;