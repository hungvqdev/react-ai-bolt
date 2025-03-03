import { ActionType } from '@/app/types';
import { SandpackPreview, SandpackPreviewRef, useSandpack } from '@codesandbox/sandpack-react'
import React, { useEffect, useRef } from 'react'

interface SandboxURLData {
  sandboxId: string;
  editorUrl: string;
  embedUrl: string;
}

interface CustomSandpackClient  {
  getCodeSandboxURL?: () => Promise<SandboxURLData>;
}


function SandpackPreviewClient({action}: {action : ActionType }) {
  const previewRef = useRef<SandpackPreviewRef | null>(null); 

  const { sandpack } = useSandpack()

  useEffect(() => {
    GetSandpackClient()
  },[sandpack && action])

  const GetSandpackClient = async () => {
    const client = previewRef.current?.getClient() as unknown as CustomSandpackClient
    if(client?.getCodeSandboxURL) {
      const result = await client?.getCodeSandboxURL() 
      if(action?.actionType === "deploy") {
        window.open('https://'+ result?.sandboxId + ".csb.app/")
      } else if (action?.actionType === 'export') {
        window?.open(result?.editorUrl)
      }
    }
  }
  return (
        <SandpackPreview
                    ref={previewRef}
                    style={{ height: "calc(100vh - 185px)" }}
                    showNavigator
                  />
  )
}

export default SandpackPreviewClient
