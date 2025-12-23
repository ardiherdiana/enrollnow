import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import { Card } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Appearance settings"
                        description="Aplikasi menggunakan tema terang (light mode) secara default"
                    />
                    <Card className="p-6">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Aplikasi ini hanya mendukung tema terang (light mode).
                                Tema gelap (dark mode) tidak tersedia.
                            </p>
                        </div>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
