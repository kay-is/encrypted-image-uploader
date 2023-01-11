import { Container, Row } from "reactstrap"
import FileUpload from "./FileUpload"
import FileDownload from "./FileDownload"

export default function App() {
  return (
    <Container>
      <Row>
        <h1>Encrypted Image Uploader</h1>
      </Row>
      {window.location.hash ? <FileDownload /> : <FileUpload />}
    </Container>
  )
}
