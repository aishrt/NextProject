"use client";
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';
import axios from 'axios';

interface UploadDocumentsDialogProps {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
}

const UploadDocumentsDialog: React.FC<UploadDocumentsDialogProps> = ({ openDialog, setOpenDialog }) => {
    const [idCardFile, setIdCardFile] = useState<File | null>(null);
    const [passportFile, setPassportFile] = useState<File | null>(null);
    const [permitCardFile, setPermitCardFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
        const file = event.target.files?.[0] || null;
        setFile(file);
    };

    const handleUpload = async () => {
        const formData = new FormData();

        if (idCardFile) formData.append('file', idCardFile);
        // if (passportFile) formData.append('passport', passportFile);
        // if (permitCardFile) formData.append('permitCard', permitCardFile);
        try {
            axios.post("/api/uploads", formData).then((response) => {
                console.log(response, "response*****")
            })
        } catch (error) {
            console.error('Error uploading documents:', error);
        }

        setOpenDialog(false);
    };

    console.log(idCardFile, "++", passportFile, "++", permitCardFile)
    return (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogContent>
                <div>
                    <label>
                        Upload ID Card
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => handleFileChange(e, setIdCardFile)}
                            style={{ display: 'block', marginTop: '8px' }} // Basic styling for visibility
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Upload Passport
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => handleFileChange(e, setPassportFile)}
                            style={{ display: 'block', marginTop: '8px' }} // Basic styling for visibility
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Upload Permit Card
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => handleFileChange(e, setPermitCardFile)}
                            style={{ display: 'block', marginTop: '8px' }} // Basic styling for visibility
                        />
                    </label>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button onClick={handleUpload}>Upload</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadDocumentsDialog;
