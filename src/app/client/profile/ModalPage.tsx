"use client";

import { useState } from "react";
import UploadDocumentsDialog from "./UploadDocumentsDialog";
import { Button } from "@/components/Form/Button";

const ProfilePage = () => {
    const [openDialog, setOpenDialog] = useState(false)

    return (
        <>
            <div className="uploaded-btn mt-3 text-center">
                <Button variant="contained" className="client-btn" onClick={() => setOpenDialog(true)}>
                    Upload New Document
                </Button>
            </div>
            <UploadDocumentsDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
        </>
    );
};

export default ProfilePage;