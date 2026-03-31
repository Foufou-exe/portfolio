<template>
  <section id="contact" class="overflow-hidden py-20">
    <div
      ref="elementRef"
      class="container mx-auto px-4 transition-all duration-700"
      :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <!-- Minimal Header -->
      <div class="mx-auto mb-12 max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
          {{ $t('contact.title') }}
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          {{ $t('contact.subtitle') }}
        </p>
      </div>

      <!-- Centered Form -->
      <div class="mx-auto max-w-lg">
        <Card class="border-0 shadow-lg p-0">
          <CardContent class="p-6 sm:p-8">
            <form class="space-y-6" @submit.prevent="handleSubmit">
              <!-- Email -->
              <div class="space-y-2">
                <Label for="email" class="text-sm font-medium">
                  {{ $t('contact.form.email') }}
                </Label>
                <Input
                  id="email"
                  v-model="form.email"
                  type="email"
                  :placeholder="$t('contact.form.emailPlaceholder')"
                  required
                  :disabled="isSubmitting"
                  class="h-12"
                />
              </div>

              <!-- Message -->
              <div class="space-y-2">
                <Label for="message" class="text-sm font-medium">
                  {{ $t('contact.form.message') }}
                </Label>
                <Textarea
                  id="message"
                  v-model="form.message"
                  :placeholder="$t('contact.form.messagePlaceholder')"
                  rows="6"
                  required
                  :disabled="isSubmitting"
                  class="resize-none"
                />
              </div>

              <!-- Submit -->
              <Button
                type="submit"
                class="h-12 w-full text-base"
                :disabled="isSubmitting"
              >
                <Loader2 v-if="isSubmitting" class="mr-2 h-5 w-5 animate-spin" />
                <Send v-else class="mr-2 h-5 w-5" />
                {{ isSubmitting ? $t('contact.form.sending') : $t('contact.form.send') }}
              </Button>
            </form>
          </CardContent>
        </Card>

        <!-- Alternative Contact -->
        <div class="mt-8 text-center">
          <p class="text-sm text-muted-foreground">
            {{ $t('contact.alternative') }}
          </p>
          <a
            :href="`mailto:${contactInfo.email}`"
            class="mt-1 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Mail class="h-4 w-4" />
            {{ contactInfo.email }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { toast } from 'vue-sonner'
import { Loader2, Mail, Send } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { contactInfo } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'

const { t } = useI18n()
const { $parseApiError } = useNuxtApp()
const { elementRef, isVisible } = useElementAnimation()

// Form state
const form = reactive({
  email: '',
  message: '',
})

const isSubmitting = ref(false)

async function handleSubmit() {
  isSubmitting.value = true

  try {
    const response = await $fetch('/api/email/contact', {
      method: 'POST',
      body: {
        email: form.email,
        message: form.message,
      },
    })

    if (response.success) {
      toast.success(t('contact.success.title'), {
        description: t('contact.success.message'),
      })
      resetForm()
    }
    else {
      throw new Error(response.error || 'Unknown error')
    }
  }
  catch (error: unknown) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error sending message:', error)
    }

    // Utiliser le parser pour obtenir un message user-friendly
    const parsed = $parseApiError(error)
    toast.error(t('contact.error.title'), {
      description: parsed.userMessage,
    })
  }
  finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  form.email = ''
  form.message = ''
}
</script>
