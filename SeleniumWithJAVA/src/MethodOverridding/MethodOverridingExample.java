package MethodOverridding;

class A {
	
	public void show(){
		
		System.out.println("1");
		
	}
	
}

class B extends A 	{

	@Override
	public void show(){
		
		System.out.println("2");
		
	}
}

public class MethodOverridingExample {

	public static void main(String[] args) {
		B obj = new B();
		obj.show();
	}
}
