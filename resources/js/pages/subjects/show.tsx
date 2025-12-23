import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mata Kuliah', href: '/subjects' },
    { title: 'Detail Mata Kuliah' },
];

interface Subject {
    id: number;
    code: string;
    name: string;
    description: string | null;
    credits: number;
    type: string;
    status: string;
}

interface SubjectsShowProps {
    subject: Subject;
}

export default function SubjectsShow({ subject }: SubjectsShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Mata Kuliah" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/subjects">
                            <Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Detail Mata Kuliah</h1>
                    </div>
                    <Link href={`/subjects/${subject.id}/edit`}>
                        <Button><Edit className="size-4 mr-2" />Edit</Button>
                    </Link>
                </div>

                <Card className="p-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Kode</p>
                            <p className="font-medium">{subject.code}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Nama</p>
                            <p className="font-medium">{subject.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">SKS</p>
                            <p className="font-medium">{subject.credits}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Tipe</p>
                            <p className="font-medium">{subject.type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                                subject.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                                {subject.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                        </div>
                        {subject.description && (
                            <div>
                                <p className="text-sm text-muted-foreground">Deskripsi</p>
                                <p className="font-medium">{subject.description}</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

