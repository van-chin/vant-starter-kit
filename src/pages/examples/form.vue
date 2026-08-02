<template>
  <div class="form-demo-page px-4 py-4 pb-8">
    <van-notice-bar left-icon="info-o" wrapable :scrollable="false">
      表单示例：van-form 校验 + 常用输入组件。提交后可在 Console 查看表单值。
    </van-notice-bar>

    <van-form @submit="onSubmit" @failed="onFailed" class="mt-4">
      <van-cell-group inset>
        <van-field
          v-model="form.name"
          name="name"
          label="姓名"
          placeholder="请输入姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-field
          v-model="form.phone"
          type="tel"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          :rules="[
            { required: true, message: '请填写手机号' },
            { pattern: /^1\d{10}$/, message: '手机号格式不正确' },
          ]"
        />
        <van-field
          v-model="form.email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          :rules="[{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确' }]"
        />
        <van-field
          v-model="form.birthday"
          is-link
          readonly
          name="birthday"
          label="生日"
          placeholder="请选择出生日期"
          @click="showBirthdayPicker = true"
        />
        <van-field
          v-model="form.avatar"
          name="avatar"
          label="头像"
          readonly
          placeholder="点击上传头像"
          @click="showUploader = true"
        >
          <template #input>
            <van-uploader
              v-if="showUploader"
              v-model="uploadFileList"
              :max-count="1"
              @update:model-value="onUploadChange"
            />
            <div v-else class="flex items-center">
              <img
                v-if="uploadFileList[0]?.content"
                :src="uploadFileList[0].content"
                class="h-8 w-8 rounded-full object-cover"
                alt="avatar"
              />
              <van-icon v-else name="photograph" size="24" class="text-gray-300" />
            </div>
          </template>
        </van-field>
      </van-cell-group>

      <van-cell-group inset class="mt-4">
        <van-cell title="性别" label="RadioGroup 单选框">
          <template #right-icon>
            <van-radio-group v-model="form.gender" direction="horizontal">
              <van-radio name="male">男</van-radio>
              <van-radio name="female">女</van-radio>
            </van-radio-group>
          </template>
        </van-cell>
        <van-cell title="兴趣" label="CheckboxGroup 复选框">
          <template #right-icon>
            <van-checkbox-group v-model="form.hobbies" direction="horizontal" class="max-w-[180px]">
              <van-checkbox name="code">写代码</van-checkbox>
              <van-checkbox name="yoga">瑜伽</van-checkbox>
              <van-checkbox name="read">阅读</van-checkbox>
            </van-checkbox-group>
          </template>
        </van-cell>
        <van-cell title="订阅通知" label="Switch 开关">
          <template #right-icon>
            <van-switch v-model="form.notify" size="20px" />
          </template>
        </van-cell>
        <van-cell title="购买数量" label="Stepper 步进器">
          <template #right-icon>
            <van-stepper v-model="form.count" min="1" max="10" />
          </template>
        </van-cell>
        <van-cell title="评分" label="Rate 评分">
          <template #right-icon>
            <van-rate v-model="form.rate" />
          </template>
        </van-cell>
      </van-cell-group>

      <div class="px-6 pt-6">
        <van-button round block type="primary" native-type="submit">提交</van-button>
        <van-button round block plain type="default" class="mt-3" @click="onReset">重置</van-button>
      </div>
    </van-form>

    <van-popup v-model:show="showBirthdayPicker" position="bottom" round>
      <van-date-picker
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirmBirthday"
        @cancel="showBirthdayPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { showToast } from 'vant';

definePage({
  meta: {
    title: '表单示例',
    showHeader: true,
    showFooter: true,
  },
});

interface UploadFile {
  content?: string;
}

const showBirthdayPicker = ref(false);
const showUploader = ref(true);
const uploadFileList = ref<UploadFile[]>([]);
const minDate = new Date(1980, 0, 1);
const maxDate = new Date(2020, 11, 31);

const form = reactive({
  name: '',
  phone: '',
  email: '',
  birthday: '',
  avatar: '',
  gender: 'male',
  hobbies: ['code'],
  notify: true,
  count: 1,
  rate: 4,
});

const onUploadChange = (files: UploadFile[]) => {
  form.avatar = files[0]?.content ? '已上传' : '';
};

const onConfirmBirthday = ({ selectedValues }: { selectedValues: string[] }) => {
  form.birthday = selectedValues.join('-');
  showBirthdayPicker.value = false;
};

const onSubmit = () => {
  showToast('提交成功');
  // eslint-disable-next-line no-console
  console.log('[form-demo] submit:', JSON.parse(JSON.stringify(form)));
};

const onFailed = ({ errors }: { errors: { message: string }[] }) => {
  showToast(errors[0]?.message ?? '请检查表单');
};

const onReset = () => {
  Object.assign(form, {
    name: '',
    phone: '',
    email: '',
    birthday: '',
    avatar: '',
    gender: 'male',
    hobbies: ['code'],
    notify: true,
    count: 1,
    rate: 4,
  });
  uploadFileList.value = [];
  showToast('已重置');
};
</script>
