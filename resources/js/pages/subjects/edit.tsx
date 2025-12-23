import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mata Kuliah', href: '/subjects' },
    { title: 'Edit Mata Kuliah' },
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

interface SubjectsEditProps {
    subject: Subject;
}

export default function SubjectsEdit({ subject }: SubjectsEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        code: subject.code || '',
        name: subject.name || '',
        description: subject.description || '',
        credits: subject.credits || 0,
        type: subject.type || 'non-board',
        status: subject.status || 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/subjects/${subject.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Mata Kuliah" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/subjects">
                        <Button variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Mata Kuliah</h1>
                </div>

                <Card className="p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="code">Kode Mata Kuliah *</Label>
                                <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} required />
                                <InputError message={errors.code} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Mata Kuliah *</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="credits">SKS *</Label>
                                <Input id="credits" type="number" value={data.credits} onChange={(e) => setData('credits', parseInt(e.target.value))} required />
                                <InputError message={errors.credits} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipe *</Label>
                                <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="board">Board</SelectItem>
                                        <SelectItem value="non-board">Non-Board</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Aktif</SelectItem>
                                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Input id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            <InputError message={errors.description} />
                        </div>
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>Simpan</Button>
                            <Link href="/subjects"><Button type="button" variant="outline">Batal</Button></Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}

