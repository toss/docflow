<script setup>
import { useRouter } from 'vitepress'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  if (typeof window !== 'undefined') {
    router.go('/')
  }
})
</script>
