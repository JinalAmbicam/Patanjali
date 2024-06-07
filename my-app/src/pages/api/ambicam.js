import axios from 'axios';
import convert from 'xml-js';

export default async function handler(req, res) {
  const { langflag } = req.query;
  const url = 'https://api.ambicam.com/ambicamapiv5.asmx';
  const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Header>
        <AuthHeader xmlns="http://tempuri.org/">
          <UserName>vmukti</UserName>
          <Password>5zqLSce7YhbyBxAwb14wc8G3R84iWXfg:yLsAV3mSMNVnW++aM7TlkJ6N+k83E1xQ</Password>
        </AuthHeader>
      </soap12:Header>
      <soap12:Body>
        <GetOnOff xmlns="http://tempuri.org/">
          <langflag>${langflag}</langflag>
        </GetOnOff>
      </soap12:Body>
    </soap12:Envelope>`;

  try {
    const response = await axios.post(url, soapRequest, {
      headers: {
        'Content-Type': 'application/soap+xml',
      },
    });

    const xmlResponse = response.data;
    const jsonResponse = convert.xml2json(xmlResponse, { compact: true, spaces: 2 });
    const result = JSON.parse(jsonResponse);

    const onOffStatus = result['soap:Envelope']['soap:Body']['GetOnOffResponse']['GetOnOffResult']._text;

    res.status(200).json({ onOffStatus });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
