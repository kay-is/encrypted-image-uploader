import React from "react"
import ReactDOM from "react-dom/client"
import { KeyringProvider } from "@w3ui/react-keyring"
import { UploaderProvider } from "@w3ui/react-uploader"
import "bootswatch/dist/quartz/bootstrap.min.css"
import App from "./components/App"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <KeyringProvider>
      <UploaderProvider>
        <App />
      </UploaderProvider>
    </KeyringProvider>
  </React.StrictMode>
)
