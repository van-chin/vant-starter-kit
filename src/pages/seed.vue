<template>
  <div class="seed-page size-full overflow-y-auto bg-[var(--color-bg-page)]">
    <!-- 故事卡片流 -->
    <div class="flex gap-3 overflow-x-auto px-4 py-3">
      <div
        v-for="(story, i) in stories"
        :key="story.id"
        class="flex w-14 shrink-0 flex-col items-center gap-1"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full text-xl ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg-page)]"
          :class="story.bg"
        >
          {{ story.emoji }}
        </div>
        <span class="text-[10px] text-[var(--color-text-secondary)]">{{ story.name }}</span>
        <span v-if="i === 0" class="text-[10px] text-[var(--color-accent)]">发布</span>
      </div>
    </div>

    <!-- 帖子列表 -->
    <div class="space-y-3 px-3 pb-4">
      <div
        v-for="post in posts"
        :key="post.id"
        class="overflow-hidden rounded-xl bg-[var(--color-bg-surface)] shadow-sm"
      >
        <!-- 作者行 -->
        <div class="flex items-center gap-2 px-3 py-2">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-full text-lg"
            :class="post.avatarBg"
          >
            {{ post.avatar }}
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium text-[var(--color-text-primary)]">
              {{ post.author }}
            </div>
            <div class="text-xs text-[var(--color-text-tertiary)]">{{ post.time }}</div>
          </div>
          <van-button size="mini" :type="post.following ? 'default' : 'primary'" round plain>
            {{ post.following ? '已关注' : '+ 关注' }}
          </van-button>
        </div>

        <!-- 内容 -->
        <div class="px-3 pb-2 text-sm leading-5 text-[var(--color-text-primary)]">
          {{ post.content }}
        </div>

        <!-- 图片墙 -->
        <div v-if="post.images" class="grid grid-cols-3 gap-1 px-3 pb-2">
          <div
            v-for="(img, i) in post.images"
            :key="i"
            class="flex h-24 items-center justify-center rounded bg-[var(--color-bg-page)] text-3xl"
          >
            {{ img }}
          </div>
        </div>

        <!-- 操作栏 -->
        <div
          class="flex items-center justify-around border-t border-[var(--color-border-subtle)] py-2"
        >
          <button
            class="flex items-center gap-1 text-xs"
            :class="
              post.liked ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
            "
            @click="toggleLike(post)"
          >
            <van-icon :name="post.liked ? 'like' : 'like-o'" size="16" />
            {{ post.likes + (post.liked ? 1 : 0) }}
          </button>
          <button
            class="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]"
            @click="onComment(post)"
          >
            <van-icon name="chat-o" size="16" />
            {{ post.comments }}
          </button>
          <button
            class="flex items-center gap-1 text-xs"
            :class="post.collected ? 'text-amber-500' : 'text-[var(--color-text-secondary)]'"
            @click="toggleCollect(post)"
          >
            <van-icon :name="post.collected ? 'star' : 'star-o'" size="16" />
            {{ post.collected ? '已收藏' : '收藏' }}
          </button>
          <button
            class="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]"
            @click="onShare(post)"
          >
            <van-icon name="share-o" size="16" />
            分享
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';

definePage({
  meta: {
    title: '种草',
    showHeader: true,
    showFooter: true,
  },
});

interface Story {
  id: string;
  name: string;
  emoji: string;
  bg: string;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  avatarBg: string;
  time: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  following: boolean;
  liked: boolean;
  collected: boolean;
}

const stories: Story[] = [
  { id: 's0', name: '发布', emoji: '➕', bg: 'bg-[var(--color-bg-page)]' },
  { id: 's1', name: '小雅', emoji: '🧘', bg: 'bg-purple-100' },
  { id: 's2', name: '阿凯', emoji: '🏃', bg: 'bg-sky-100' },
  { id: 's3', name: 'Momo', emoji: '🥗', bg: 'bg-green-100' },
  { id: 's4', name: '陈晨', emoji: '🌅', bg: 'bg-amber-100' },
  { id: 's5', name: 'Lily', emoji: '🧖', bg: 'bg-pink-100' },
];

const posts = ref<Post[]>([
  {
    id: '1',
    author: '小雅 YogaGirl',
    avatar: '🧘',
    avatarBg: 'bg-purple-100',
    time: '12 分钟前',
    content:
      '第 21 天晨间瑜伽打卡 ✅ 坚持三周最大的变化：肩颈不酸了，睡眠质量肉眼可见地提升。附上今天拍的日出照，愿大家都能找到属于自己的节奏 🌅',
    images: ['🌅', '🧘', '☕'],
    likes: 128,
    comments: 23,
    following: true,
    liked: true,
    collected: false,
  },
  {
    id: '2',
    author: '阿凯 Runner',
    avatar: '🏃',
    avatarBg: 'bg-sky-100',
    time: '45 分钟前',
    content:
      '把力量训练和瑜伽结合起来之后，跑 5km 居然轻松了不少。核心稳定真的是一切运动的地基 💪 分享一个我最爱的核心激活序列：',
    images: ['💪', '🧘', '🏃'],
    likes: 89,
    comments: 12,
    following: false,
    liked: false,
    collected: true,
  },
  {
    id: '3',
    author: 'Momo 轻食日记',
    avatar: '🥗',
    avatarBg: 'bg-green-100',
    time: '2 小时前',
    content:
      '工作日 10 分钟快手轻食：牛油果鸡蛋吐司 + 希腊酸奶杯。热量约 380 大卡，蛋白质 25g，好吃不胖！配料表和步骤都放图里啦～',
    images: ['🥗', '🥑', '🍳'],
    likes: 256,
    comments: 41,
    following: true,
    liked: false,
    collected: false,
  },
  {
    id: '4',
    author: '陈晨 冥想日记',
    avatar: '🌅',
    avatarBg: 'bg-amber-100',
    time: '昨天',
    content:
      '冥想不是"放空"，而是"专注"。初学者可以试试 4-7-8 呼吸法：吸气 4 秒，屏息 7 秒，呼气 8 秒。坚持一周你会发现焦虑少了很多 🕯️',
    images: ['🕯️', '🌙', '🧠'],
    likes: 310,
    comments: 55,
    following: false,
    liked: false,
    collected: true,
  },
]);

const toggleLike = (post: Post) => {
  post.liked = !post.liked;
  showToast(post.liked ? '点赞成功' : '已取消点赞');
};

const toggleCollect = (post: Post) => {
  post.collected = !post.collected;
  showToast(post.collected ? '已收藏' : '已取消收藏');
};

const onComment = (post: Post) => {
  showToast(`评论（${post.comments}）功能示例`);
};

const onShare = (post: Post) => {
  showToast(`分享 ${post.author} 的内容`);
};
</script>
