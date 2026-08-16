import React, { useEffect } from 'react';
import { useState } from 'react';
import { setup2fa } from '../service/authApi';

const TwoFASetup = ({onSetupComplete}) => {
    const [message, setMessage] = useState("");

    const [response, setResponse] = useState({});

    const fetchQRCode = async () => {
        const {data} = await setup2fa();
        console.log("data")
        setResponse(data);
    };

    useEffect(() => {
        fetchQRCode()
    }, []);

    const copyClipBoard = async () => {
        await navigator.clipboard.writeText(response.secret);
        setMessage("Secret Copied to clipboard");
    }
    return (
        <div className="bg-white rounded-lg shadow-md w-full max-w-sm mx-auto">
            <div className="pt-6">
                <h2 className="text-3xl text-center font-extralight">
                    Turn on 2FA Verification
                    </h2>
                </div>  
                <hr className='text-gray-200 mt-6 mb-6'/> 
                <p className='text-center text-gray-600 text-lg font-light pr-6 pl-6'>
                    Scan the QR code with your authenticator app
                    </p>
                <div className="p-6">
                <div className="flex justify-center">
                        <img src={response.qrCode} alt="2FA QR Code" className="mb-4 border rounded-md" />
                </div>
                </div>
                <div className="flex items-center mt-3 mb-3">
                    <div className="border-t border-1 border-gray-300 flex-grow">
                        <div className="text-gray-600 text-sm font-light pr-2 pl-2">
                            Or Enter The Code Manually
                        </div>
                        <div className= "mb-6">
                            {message && <p className="text-green-500 text-sm mb-3">{message}</p>}
                            <input 
                            readOnly 
                            defaultValue="" 
                            value={response.secret} 
                            className="w-full border rounded mt-2 text-xs text-gray-600 p-4"
                            onClick={copyClipBoard}/>
                            <button onClick={onSetupComplete} className="w-full bg-blue-300 text-white py-2 rounded-md">
                                Continue to Verification
                            </button>
                        </div>
                    </div>
                </div>
   </div>
    );
};

export default TwoFASetup;

