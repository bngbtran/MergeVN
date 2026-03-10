<script setup>
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

function downloadApk() {
    toast.add({
        severity: 'success',
        summary: 'Đang tải APK',
        detail: 'File APK Android đang được tải xuống...',
        life: 3000
    });

    setTimeout(() => {
        window.open('/apk/mergevn.apk', '_blank');
    }, 500);
}

function sendEmail() {
    toast.add({
        severity: 'info',
        summary: 'Mở email',
        detail: 'Đang mở ứng dụng email...',
        life: 3000
    });

    setTimeout(() => {
        window.location.href = 'mailto:tranbnb.2004@gmail.com';
    }, 500);
}
</script>

<template>
    <Toast />

    <div class="relative min-h-160 lg:min-h-0 bg-surface-0 dark:bg-surface-900 flex lg:flex-row flex-col">
        <div class="flex lg:flex-row flex-col justify-center md:justify-normal h-full flex-1">
            <!-- TEXT -->
            <div class="relative flex-1 z-20 flex items-center justify-center">
                <div class="w-full max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left">
                    <h1 class="text-4xl xl:text-5xl font-bold text-surface-0 lg:text-surface-900 dark:text-surface-0 mb-6 leading-tight!">
                        <span class="block">Liên hệ Admin của</span>
                        <span class="block text-primary">MergeVN</span>
                    </h1>

                    <p class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-xl leading-normal mb-6">Nếu bạn phát hiện sai sót trong dữ liệu địa chỉ hoặc có đề xuất cải thiện, hãy gửi email cho chúng tôi.</p>

                    <p class="flex items-center justify-center lg:justify-start gap-2 text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-lg mb-8">
                        <i class="pi pi-envelope"></i>

                        <span>Email:</span>

                        <a href="mailto:tranbnb.2004@gmail.com" class="hover:underline"> tranbnb.2004@gmail.com </a>
                    </p>

                    <div class="flex items-center gap-4 justify-center lg:justify-start">
                        <Button label="Tải APK Android" icon="pi pi-download" @click="downloadApk" />

                        <Button label="Gửi email" icon="pi pi-envelope" outlined @click="sendEmail" />
                    </div>
                </div>
            </div>

            <!-- IMAGE -->
            <div class="flex-1 flex items-center justify-center p-10">
                <img src="/mergevn-icon.png" alt="MergeVN" class="max-h-80 w-auto object-contain drop-shadow-2xl" />
            </div>
        </div>
    </div>
    <div class="bg-surface-0 dark:bg-surface-950 px-6 md:px-12 lg:px-20 py-20 text-center">
        <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center gap-4">
                <div class="font-bold text-3xl leading-tight">
                    <span class="text-surface-900 dark:text-surface-0">Chuyển đổi địa chỉ </span>
                    <span class="text-primary-500 dark:text-primary-400">nhanh chóng & chính xác</span>
                </div>

                <div class="text-surface-500 dark:text-surface-400 leading-tight text-center max-w-2xl">
                    <span class="text-primary font-bold italic">MergeVN</span> giúp tra cứu và chuyển đổi địa chỉ hành chính cũ sang địa chỉ mới theo dữ liệu cập nhật.
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Feature 1 -->
                <div class="w-full rounded-md p-4">
                    <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                        <i class="pi pi-globe text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                    </span>

                    <div class="flex flex-col gap-1">
                        <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Xây cho người Việt</div>

                        <p class="text-surface-500 dark:text-surface-400 leading-normal">Công cụ được thiết kế dành riêng cho hệ thống địa giới hành chính Việt Nam, hỗ trợ chuyển đổi địa chỉ cũ sang địa chỉ mới nhanh chóng.</p>
                    </div>
                </div>

                <!-- Feature 2 -->
                <div class="w-full rounded-md p-4">
                    <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                        <i class="pi pi-bolt text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                    </span>

                    <div class="flex flex-col gap-1">
                        <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Dễ sử dụng</div>

                        <p class="text-surface-500 dark:text-surface-400 leading-normal">Chỉ cần chọn tỉnh, huyện và xã cũ, hệ thống sẽ tự động hiển thị địa chỉ mới sau khi thay đổi hoặc sáp nhập.</p>
                    </div>
                </div>

                <!-- Feature 3 -->
                <div class="w-full rounded-md p-4">
                    <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-0 dark:bg-surface-800 shadow mx-auto">
                        <i class="pi pi-check-circle text-2xl! lg:text-3xl! text-primary-500 dark:text-primary-400" />
                    </span>

                    <div class="flex flex-col gap-1">
                        <div class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-tight">Thông tin chính xác</div>

                        <p class="text-surface-500 dark:text-surface-400 leading-normal">Dữ liệu địa chỉ được tổng hợp và cập nhật liên tục để đảm bảo kết quả chuyển đổi chính xác và đáng tin cậy.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
