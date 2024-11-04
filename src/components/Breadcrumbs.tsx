'use client'
import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MatLink from '@mui/material/Link';
import Link from 'next/link';

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function Breadcrumb({ last }: { last: string }) {
    return (
        <div role="presentation" onClick={handleClick} className='mb-2'>
            <Breadcrumbs aria-label="breadcrumb">
                <Link href="/admin/dashboard" className='mui-link'>
                    Home
                </Link>

                <MatLink
                    underline="hover"
                    color="text.primary"
                    href="/admin/categories"
                    aria-current="page"
                >
                    {last}
                </MatLink>
            </Breadcrumbs>
        </div>
    );
}
