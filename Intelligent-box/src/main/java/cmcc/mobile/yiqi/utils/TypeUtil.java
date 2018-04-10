package cmcc.mobile.yiqi.utils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class TypeUtil {
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static void fatherToChild(Object father, Object child) throws Exception {
		if (!(child.getClass().getSuperclass() == father.getClass())) {
			throw new Exception("child不是father的子类");
		}
		Class fatherClass = father.getClass();
		Field ff[] = fatherClass.getDeclaredFields();
		for (int i = 0; i < ff.length; i++) {
			Field f = ff[i];// 取出每一个属性，如deleteDate
			if (!(f.getName().indexOf("$") == 0)) {
				f.setAccessible(true);
				Method m = fatherClass.getMethod("get" + upperHeadChar(f.getName()));// 方法getDeleteDate
				m.setAccessible(true);
				Object obj = m.invoke(father);// 取出属性值
				f.set(child, obj);
			}
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static void ClassToClass(Object object, Object goalObject) throws Exception {
		if (!(goalObject.getClass() == object.getClass())) {
			throw new Exception("child不是father的子类");
		}
		Class fatherClass = object.getClass();
		Field ff[] = fatherClass.getDeclaredFields();
		for (int i = 0; i < ff.length; i++) {
			Field f = ff[i];// 取出每一个属性，如deleteDate
			if (!(f.getName().indexOf("$") == 0)) {
				f.setAccessible(true);
				Method m = fatherClass.getMethod("get" + upperHeadChar(f.getName()));// 方法getDeleteDate
				m.setAccessible(true);
				Object obj = m.invoke(object);// 取出属性值
				f.set(goalObject, obj);
			}
		}
	}

	private static String upperHeadChar(String in) {
		String head = in.substring(0, 1);
		String out = head.toUpperCase() + in.substring(1, in.length());
		return out;
	}
}
