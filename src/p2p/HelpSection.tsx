import { Accordion } from 'flowbite-react'

const HelpSection = () => {
  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Help Section</h2>
      <Accordion>
        <Accordion.Panel>
          <Accordion.Title>Register File</Accordion.Title>
          <Accordion.Content>
            <p>
              <strong>Command:</strong> `register_file &lt;fileName&gt;`
            </p>
            <p>
              Use this command to register a file with the tracker. Replace
              <code>&lt;fileName&gt;</code> with the actual file name.
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>Download File</Accordion.Title>
          <Accordion.Content>
            <p>
              <strong>Command:</strong> `download_file &lt;fileName_i&gt;`
            </p>
            <p>
              Use this command to download a file from a peer. Replace
              <code>&lt;fileName_i&gt;</code> with the file name you want to download.
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>List Files</Accordion.Title>
          <Accordion.Content>
            <p>
              <strong>Command:</strong> `list_files`
            </p>
            <p>Lists all available files in the tracker.</p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>Show Peer Information</Accordion.Title>
          <Accordion.Content>
            <p>
              <strong>Command:</strong> `me`
            </p>
            <p>Displays information about the current peer, including IP address and speeds.</p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>Exit Application</Accordion.Title>
          <Accordion.Content>
            <p>
              <strong>Command:</strong> `exit`
            </p>
            <p>Exits the application safely.</p>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </div>
  )
}

export default HelpSection
