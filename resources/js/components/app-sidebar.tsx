import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, FileText, LayoutGrid, BookMarked, Users, User, GraduationCap } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const page = usePage();
    const auth = (page.props as any)?.auth;
    const isAdmin = auth?.user?.role === 'admin';

    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Mahasiswa',
            href: '/students',
            icon: Users,
        },
        {
            title: 'Mata Kuliah',
            href: '/subjects',
            icon: BookOpen,
        },
        {
            title: 'Periode',
            href: '/periods',
            icon: Calendar,
        },
        {
            title: 'Enrollment',
            href: '/enrollments',
            icon: BookMarked,
        },
        {
            title: 'Nilai',
            href: '/grades',
            icon: FileText,
        },
    ];

    const userNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Profil Saya',
            href: '/student/profile',
            icon: User,
        },
        {
            title: 'Pilih Mata Kuliah',
            href: '/student/enrollments/create',
            icon: BookOpen,
        },
        {
            title: 'Enrollment Saya',
            href: '/student/enrollments',
            icon: GraduationCap,
        },
        {
            title: 'Nilai Saya',
            href: '/grades',
            icon: FileText,
        },
    ];

    const mainNavItems = isAdmin ? adminNavItems : userNavItems;
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
