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
            <form @submit.prevent="handleSubmit" class="space-y-6">
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

            <!-- Success Alert -->
            <Alert 
              v-if="submitStatus === 'success'" 
              class="mt-6 border-green-500/50 bg-green-500/10"
            >
              <CheckCircle class="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle class="text-green-600 dark:text-green-400">
                {{ $t('contact.success.title') }}
              </AlertTitle>
              <AlertDescription class="text-green-600/80 dark:text-green-400/80">
                {{ $t('contact.success.message') }}
              </AlertDescription>
            </Alert>

            <!-- Error Alert -->
            <Alert 
              v-if="submitStatus === 'error'" 
              class="mt-6" 
              variant="destructive"
            >
              <AlertCircle class="h-4 w-4" />
              <AlertTitle>{{ $t('contact.error.title') }}</AlertTitle>
              <AlertDescription>
                {{ errorMessage || $t('contact.error.message') }}
              </AlertDescription>
            </Alert>
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

        <!-- Social Links -->
        <div class="mt-8 flex justify-center">
          <SocialLinks variant="ghost" size="icon" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  Mail, 
  Send 
} from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import SocialLinks from '~/components/common/SocialLinks.vue'
import { contactInfo } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'

const { elementRef, isVisible } = useElementAnimation()

// Form state
const form = reactive({
  email: '',
  message: '',
})

const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')
const errorMessage = ref<string | null>(null)

async function handleSubmit() {
  isSubmitting.value = true
  submitStatus.value = 'idle'
  errorMessage.value = null

  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        email: form.email,
        message: form.message,
      },
    })

    if (response.success) {
      submitStatus.value = 'success'
      resetForm()
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        submitStatus.value = 'idle'
      }, 5000)
    } else {
      throw new Error(response.error || 'Erreur inconnue')
    }
  } catch (error: unknown) {
    console.error('Erreur lors de l\'envoi:', error)
    submitStatus.value = 'error'
    
    if (error instanceof Error) {
      errorMessage.value = error.message
    }
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  form.email = ''
  form.message = ''
}
</script>
