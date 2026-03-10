<script setup>
import Button from 'primevue/button';

function downloadApk() {
    window.open('/apk/mergevn.apk', '_blank');
}
</script>

<template>
    <div class="relative min-h-160 lg:min-h-0 bg-surface-0 dark:bg-surface-900 flex lg:flex-row flex-col">
        <div class="flex lg:flex lg:flex-row flex-col justify-center md:justify-normal h-full flex-1">
            <!-- TEXT -->
            <div class="relative flex-1 z-20 flex items-center justify-center">
                <div class="flex items-center justify-center h-full">
                    <div class="w-full max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left">
                        <h1 class="text-4xl xl:text-5xl font-bold text-surface-0 lg:text-surface-900 dark:text-surface-0 mb-6 leading-tight!">
                            <span class="block">Liên hệ Admin của</span>
                            <span class="block text-primary">MergeVN</span>
                        </h1>

                        <p class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-xl leading-normal mb-6 max-w-xl lg:max-w-none">
                            Nếu bạn phát hiện sai sót trong dữ liệu địa chỉ hoặc có đề xuất cải thiện, hãy gửi email cho chúng tôi.
                        </p>

                        <p class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-lg mb-8">
                            📧 Email:
                            <a href="mailto:tranbnb.2004@gmail.com" class="text-primary font-semibold"> tranbnb.2004@gmail.com </a>
                        </p>

                        <div class="flex items-center gap-4 justify-center lg:justify-start">
                            <Button label="Tải APK Android" icon="pi pi-download" @click="downloadApk" />
                            <Button label="Gửi email" icon="pi pi-envelope" outlined @click="() => (window.location = 'mailto:tranbnb.2004@gmail.com')" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- IMAGE -->
            <div class="absolute lg:relative inset-0 lg:inset-auto flex-1">
                <div class="absolute lg:hidden inset-0 bg-surface-900/60 dark:bg-surface-900/80 z-10" />
                <img src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/hero/hero-1.png" alt="contact" class="h-full w-full object-cover xl:[clip-path:polygon(12%_0,100%_0%,100%_100%,0_100%)]" />
            </div>
        </div>
    </div>
</template>
