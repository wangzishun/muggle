import { FC, useEffect } from 'react'
import ReactTypes from '../../node_modules/@types/react/index.d.ts?raw'

console.log('ReactTypes', ReactTypes)

import MonacoEditor, { useMonaco } from '@monaco-editor/react'

import {
  useActiveCode,
  SandpackStack,
  FileTabs,
  useSandpack,
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackConsole
} from '@codesandbox/sandpack-react'
import { OnePxBorder } from '../components/1px-border'
import { Uri } from 'monaco-editor'

const str = `

import styled from 'styled-components'

const OnePxBorderDiv = styled.div\`
  border: 1px solid black;
\`

export const OnePxBorder = () => {
  return <OnePxBorderDiv />
}

export default function App() {
  return <div>111</div>
}

`

const react = `
import { useState } from 'react'
export default function App() {
  const [count] = useState(11111)
  return <div>{count}</div>
}
Facts.next
FactsS.next

import * as x from "external"
const tt : string = x.dnext();
`

export const SandpackMonacoEditorCore: FC = () => {
  const monaco = useMonaco()

  useEffect(() => {
    if (monaco) {
    }
  }, [monaco])

  const { sandpack } = useSandpack()
  console.log(sandpack)
  const { code, updateCode } = useActiveCode()

  console.log(OnePxBorder.toString())
  return (
    <SandpackStack>
      <FileTabs />
      <MonacoEditor
        height="100vh"
        defaultLanguage="typescript"
        key={sandpack.activeFile}
        defaultValue={react}
        onChange={(value) => updateCode(value || '')}
        options={{ minimap: { enabled: false } }}
        beforeMount={(monaco) => {
          // validation settings
          monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false
          })

          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ESNext,
            allowNonTsExtensions: true,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            noEmit: true,
            typeRoots: ['node_modules/@types']
          })

          // extra libraries
          var libSource = [
            'declare class Facts {',
            '    /**',
            '     * Returns the next fact',
            '     */',
            '    static next():string',
            '}'
          ].join('\n')
          var libUri = 'ts:filename/facts.d.ts'
          monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri)
          // When resolving definitions and references, the editor will try to use created models.
          // Creating a model for the library allows "peek definition/references" commands to work with the library.
          monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri))


          monaco.languages.typescript.typescriptDefaults.addExtraLib(ReactTypes, 'ts:filename/react.d.ts')
          monaco.languages.typescript.javascriptDefaults.addExtraLib(ReactTypes, 'ts:filename/react.d.ts')

          monaco.editor.createModel(ReactTypes, 'typescript', monaco.Uri.parse('ts:filename/react.d.ts'))

          const externalDTS = `export declare function next() : string`

          monaco.languages.typescript.typescriptDefaults.addExtraLib(
            externalDTS,
            'node_modules/@types/external/index.d.ts'
          )

          monaco.languages.typescript.typescriptDefaults.addExtraLib(externalDTS, `file:///node_modules/external.d.ts`)

          monaco.languages.typescript.typescriptDefaults.addExtraLib(
            'export declare function add(a: number, b: number): number',
            'file:///node_modules/@types/math/index.d.ts'
          )

          monaco.editor.createModel(
            `import {add} from 'math';\nconst x = add(3, 5);\n`,
            'typescript',
            monaco.Uri.parse('file:///main.tsx')
          )

        }}
      />
    </SandpackStack>
  )
}

SandpackMonacoEditorCore.defaultProps = {}

export type SandpackMonacoEditorProps = {}

export const SandpackMonacoEditor: FC<SandpackMonacoEditorProps> = () => {
  return (
    <SandpackProvider template="react-ts">
      <SandpackLayout style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
        <SandpackPreview showNavigator></SandpackPreview>
        <SandpackMonacoEditorCore />
        {/* <SandpackConsole /> */}
      </SandpackLayout>
    </SandpackProvider>
  )
}
