import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import InputError from '@/components/input-error';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profil Saya',
        href: '/student/profile',
    },
    {
        title: 'Edit Profil',
        href: '#',
    },
];

interface Student {
    id: number;
    student_id: string;
    name: string;
    email: string | null;
    phone: string | null;
    date_of_birth: string | null;
    address: string | null;
    status: string;
}

interface StudentProfileEditProps {
    student: Student;
}

export default function StudentProfileEdit({ student }: StudentProfileEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: student.name || '',
        phone: student.phone || '',
        date_of_birth: student.date_of_birth || '',
        address: student.address || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/student/profile');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Profil" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Link href="/student/profile">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Profil</h1>
                </div>

                <Card className="p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="student_id">NIM</Label>
                                <Input
                                    id="student_id"
                                    value={student.student_id}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">NIM tidak dapat diubah</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Masukkan nama lengkap"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={student.email || ''}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">No. Telepon</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="081234567890"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
                                <DatePicker
                                    id="date_of_birth"
                                    value={data.date_of_birth}
                                    onChange={(value) => setData('date_of_birth', value)}
                                    placeholder="Pilih tanggal lahir"
                                />
                                <InputError message={errors.date_of_birth} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Alamat</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Masukkan alamat"
                            />
                            <InputError message={errors.address} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Simpan
                            </Button>
                            <Link href="/student/profile">
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}

